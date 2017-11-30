FROM rabbitmq:3.6.14-alpine

RUN apk add --no-cache --virtual .build-deps \
		ca-certificates \
		curl \
	; \
	\
	curl http://www.rabbitmq.com/community-plugins/v3.6.x/rabbitmq_delayed_message_exchange-0.0.1.ez > $RABBITMQ_HOME/plugins/rabbitmq_delayed_message_exchange-0.0.1.ez; \
	\
	apk del .build-deps;

RUN rabbitmq-plugins enable --offline rabbitmq_delayed_message_exchange
RUN rabbitmq-plugins enable --offline rabbitmq_consistent_hash_exchange


# Install the managment plugin
RUN rabbitmq-plugins enable --offline rabbitmq_management

# extract "rabbitmqadmin" from inside the "rabbitmq_management-X.Y.Z.ez" plugin zipfile
# see https://github.com/docker-library/rabbitmq/issues/207
RUN set -eux; \
	erl -noinput -eval ' \
		{ ok, AdminBin } = zip:foldl(fun(FileInArchive, GetInfo, GetBin, Acc) -> \
			case Acc of \
				"" -> \
					case lists:suffix("/rabbitmqadmin", FileInArchive) of \
						true -> GetBin(); \
						false -> Acc \
					end; \
				_ -> Acc \
			end \
		end, "", init:get_plain_arguments()), \
		io:format("~s", [ AdminBin ]), \
		init:stop(). \
	' -- /plugins/rabbitmq_management-*.ez > /usr/local/bin/rabbitmqadmin; \
	[ -s /usr/local/bin/rabbitmqadmin ]; \
	chmod +x /usr/local/bin/rabbitmqadmin; \
	apk add --no-cache python; \
	rabbitmqadmin --version

EXPOSE 15671 15672