class AddDynamicSegmentIdToMessageTemplates < ActiveRecord::Migration

    Audience = Rover::Audience::V1
    Auth = Rover::Auth::V1

    def up
        add_column :message_templates, :dynamic_segment_id, :string

        # Holds mapping from old customer_segment_id to what was created in audience service
        mapped_segments = {}

        CustomerSegment.all.find_in_batches(batch_size: 500) do |group|
            group.each do |m|
                s = create_dynamic_segment(m.id)
                mapped_segments[m.id] = s
            end
        end

        MessageTemplate.all.find_in_batches(batch_size: 500) do |group|
            group.each do |m|
                if m.customer_segment_id.nil?
                    next
                end

                if mapped_segments[m.customer_segment_id].present?
                    new_id = mapped_segments[m.customer_segment_id].id
                    m.update_column(:dynamic_segment_id, new_id)
                else
                    Rails.logger.warn("Segment did not port correctly id: #{m.customer_segment_id}")
                end
            end
        end



    end

    def down
        remove_column :message_templates, :dynamic_segment_id
    end


    def create_dynamic_segment(customer_segment_id)
        c = CustomerSegment.find_by(id: customer_segment_id)
        if c.nil?
            return nil
        end

        predicates = c.filters.map do |filter|
            if filter.model == "customer"
                pred = Audience::Predicate.new(selector: :CUSTOM_PROFILE)
                case filter.attribute_name
                when "gender"
                    pred.string_predicate = Audience::StringPredicate.new(
                        op: :IS_EQUAL,
                        attribute_name: "gender",
                        value: filter.comparer.value
                    )
                when "age"
                    if filter.comparer.to.present? && filter.comparer.from.present?
                        pred.number_predicate = Audience::NumberPredicate.new(
                            op: :IS_BETWEEN,
                            attribute_name: "age",
                            value: filter.comparer.from,
                            value2: filter.comparer.to || 100
                        )
                    else
                        pred.number_predicate = Audience::NumberPredicate.new(
                            op: :IS_GREATER_THAN,
                            attribute_name: "age",
                            value: filter.comparer.value || filter.comparer.from
                        )
                    end
                when "tags"
                    op = :CONTAINS_ALL
                    if filter.comparer.method == "does_not_contain"
                        op = :DOES_NOT_CONTAIN_ALL
                    end

                    pred.string_array_predicate = Audience::StringArrayPredicate.new(
                        op: op,
                        attribute_name: "tags",
                        value: filter.comparer.value.is_a?(String) ? [filter.comparer.value] : filter.comparer.value
                    )

                else
                    pred = nil
                end

                pred
            elsif filter.model == "device"
                pred = Audience::Predicate.new(selector: :DEVICE)
                case filter.attribute_name
                when "locale-lang"
                    pred.string_predicate = Audience::StringPredicate.new(
                        op: :IS_EQUAL,
                        attribute_name: "locale_language",
                        value: filter.comparer.value.is_a?(Array) ? filter.comparer.value.first : filter.comparer.value
                    )
                when "location"
                    pred.geofence_predicate = Audience::GeofencePredicate.new(
                        op: :IS_WITHIN,
                        attribute_name: "location",
                        value: Audience::GeofencePredicate::Location.new(longitude: filter.comparer.longitude, latitude: filter.comparer.latitude, radius: filter.comparer.radius)
                    )
                when "os-name"
                    pred.string_predicate = Audience::StringPredicate.new(
                        op: :IS_EQUAL,
                        attribute_name: "os_name",
                        value: filter.comparer.value
                    )
                when "bluetooth-enabled"
                    pred.bool_predicate = Audience::BoolPredicate.new(
                        op: :IS_EQUAL,
                        attribute_name: "is_bluetooth_enabled",
                        value: filter.comparer.value
                    )
                when "sdk-version"
                    op = :IS_SET
                    if (filter.comparer.method === "exists")
                        op = :IS_SET
                    else
                        op = :IS_UNSET
                    end

                    pred.version_predicate = Audience::VersionPredicate.new(
                        op: op,
                        attribute_name: "sdk_version"
                    )
                when "is-test-device"
                    pred.bool_predicate = Audience::BoolPredicate.new(
                        op: :IS_EQUAL,
                        attribute_name: "is_test_device",
                        value: true
                    )
                else
                    pred = nil
                end

                pred
            else
                nil
            end
        end

        predicates = predicates.compact

        aggregate = Audience::PredicateAggregate.new(condition: :ALL, predicates: predicates)

        req = Audience::CreateDynamicSegmentRequest.new(
            title: c.title,
            auth_context: Auth::AuthContext.new(account_id: c.account_id),
            predicate_aggregate: aggregate
        )

        client = Rover::Audience::V1::DefaultClient.new

        return client.create_dynamic_segment(req).segment
    end

end
