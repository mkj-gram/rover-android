module Events
    module XenioEvents
        class XenioEvent < Event

            Events::Pipeline.register("xenio-zone", "enter", self, { targetable: true })
            Events::Pipeline.register("xenio-zone", "exit", self, { targetable: true })
            Events::Pipeline.register("xenio-place", "enter", self, { targetable: true })
            Events::Pipeline.register("xenio-zone", "exit", self, { targetable: true })

        end
    end
end