package io.rover.experiences.ui.layout

import io.rover.experiences.data.domain.Background
import io.rover.experiences.data.domain.BackgroundContentMode
import io.rover.experiences.data.domain.BackgroundScale
import io.rover.experiences.data.domain.Border
import io.rover.experiences.data.domain.Color
import io.rover.experiences.data.domain.Height
import io.rover.experiences.data.domain.HorizontalAlignment
import io.rover.core.data.domain.ID
import io.rover.experiences.data.domain.Insets
import io.rover.experiences.data.domain.Position
import io.rover.experiences.data.domain.RectangleBlock
import io.rover.experiences.data.domain.Row
import io.rover.experiences.data.domain.Screen
import io.rover.experiences.data.domain.StatusBar
import io.rover.experiences.data.domain.StatusBarStyle
import io.rover.experiences.data.domain.TitleBar
import io.rover.experiences.data.domain.TitleBarButtons
import io.rover.experiences.data.domain.VerticalAlignment

class ModelFactories {
    companion object {
        /**
         * Construct an empty [Screen].
         */
        fun emptyScreen(): Screen {
            return Screen(
                background = Background(
                    color = Black,
                    contentMode = BackgroundContentMode.Original,
                    image = null,
                    scale = BackgroundScale.X1
                ),
                id = ID("0"),
                isStretchyHeaderEnabled = false,
                rows = listOf(),
                statusBar = StatusBar(
                    style = StatusBarStyle.Dark,
                    color = Color(0, 0, 0x7f, 1.0)
                ),
                titleBar = TitleBar(
                    backgroundColor = Transparent,
                    buttons = TitleBarButtons.Both,
                    buttonColor = DarkBlue,
                    text = "Title bar",
                    textColor = Color(0xff, 0xff, 0xff, 1.0),
                    useDefaultStyle = true
                ),
                keys = emptyMap()
            ).copy()
        }

        fun emptyRow(): Row {
            return Row(
                height = Height.Static(
                    0.0
                ),
                background = Background(
                    color = Black,
                    contentMode = BackgroundContentMode.Original,
                    image = null,
                    scale = BackgroundScale.X1
                ),
                blocks = listOf(),
                id = ID("0")
            )
        }

        fun emptyRectangleBlock(): RectangleBlock {
            return RectangleBlock(
                tapBehavior = null,
                position = Position(
                    horizontalAlignment = HorizontalAlignment.Fill(
                        0.0, 0.0
                    ),
                    verticalAlignment = VerticalAlignment.Top(
                        0.0, Height.Static(0.0)
                    )
                ),
                background = Background(
                    color = Black,
                    contentMode = BackgroundContentMode.Original,
                    image = null,
                    scale = BackgroundScale.X1
                ),
                border = Border(
                    color = Black,
                    radius = 0,
                    width = 1
                ),
                id = ID(""),
                insets = Insets(0, 0, 0, 0),
                opacity = 1.0,
                keys = emptyMap()
            )
        }

        val White = Color(0xff, 0xff, 0xff, 1.0)
        val Black = Color(0, 0, 0, 1.0)
        val Transparent = Color(0xff, 0xff, 0xff, 0.0)
        val DarkBlue = Color(0, 0, 0x7f, 1.0)
    }
}
