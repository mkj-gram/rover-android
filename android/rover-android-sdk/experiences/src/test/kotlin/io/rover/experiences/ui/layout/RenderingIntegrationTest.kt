package io.rover.experiences.ui.layout

import io.rover.experiences.ExperiencesAssembler
import io.rover.experiences.MeasurementService
import io.rover.experiences.ui.layout.screen.ScreenViewModelInterface
import io.rover.rover.core.assets.AssetService
import io.rover.rover.core.assets.ImageOptimizationServiceInterface
import io.rover.rover.core.container.Assembler
import io.rover.rover.core.container.Container
import io.rover.rover.core.container.InjectionContainer
import io.rover.rover.core.container.Resolver
import io.rover.rover.core.container.Scope
import io.rover.rover.core.context.ModulesTrackerInterface
import io.rover.rover.core.data.domain.Experience
import io.rover.rover.core.data.graphql.operations.data.decodeJson
import io.rover.rover.core.logging.GlobalStaticLogHolder
import io.rover.rover.core.logging.JvmLogger
import io.rover.rover.core.logging.log
import io.rover.rover.core.operations.ActionBehaviourMappingInterface
import org.amshove.kluent.mock
import org.amshove.kluent.shouldBeLessThan
import org.jetbrains.spek.api.Spek
import org.jetbrains.spek.api.dsl.describe
import org.jetbrains.spek.api.dsl.it
import org.jetbrains.spek.api.dsl.on
import org.json.JSONObject
import kotlin.system.measureNanoTime

class RenderingIntegrationTest : Spek({
    describe("integration test with a full experience in JSON") {
        GlobalStaticLogHolder.globalLogEmitter = JvmLogger()
        val realObjectStack = InjectionContainer(
            listOf(
                ExperiencesAssembler(),
                object : Assembler {
                    override fun assemble(container: Container) {
                        container.register(Scope.Singleton, AssetService::class.java) { resolver ->
                            mock()
                        }

                        container.register(Scope.Singleton, ImageOptimizationServiceInterface::class.java) { resolver ->
                            mock()
                        }

                        container.register(Scope.Singleton, ModulesTrackerInterface::class.java) { resolver ->
                            mock()
                        }

                        container.register(Scope.Singleton, ActionBehaviourMappingInterface::class.java) { resolver ->
                            mock()
                        }

                        container.register(
                            Scope.Singleton,
                            MeasurementService::class.java
                        ) { _: Resolver -> mock() }
                    }
                }
            )
        )
        realObjectStack.initializeContainer()

        val experienceJson = this.javaClass.classLoader.getResourceAsStream("experience.json").bufferedReader(Charsets.UTF_8).readText()
        val experience = Experience.decodeJson(JSONObject(experienceJson))

        log.v("There are ${experience.screens.count()} screens.")

        on("layout") {
            val screenViewModels = experience.screens.map {
                realObjectStack.resolve(ScreenViewModelInterface::class.java, null, it)!!
            }

            val rendered: MutableList<Layout> = mutableListOf()
            val renderTimeNs = measureNanoTime {
                screenViewModels.forEach { screenViewModel ->
                    rendered.add(
                        screenViewModel.render(
                            100f
                        )
                    )
                }

            }
            val renderTimeMs = renderTimeNs / 1000000
            log.v("Took $renderTimeMs ms to render all ${experience.screens.count()} screens.")

            it("should have taken") {
                renderTimeMs.shouldBeLessThan(200)
            }
        }
    }
})