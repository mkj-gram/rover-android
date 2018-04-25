package io.rover.app.experiences.views

import android.content.Context
import android.support.design.widget.CoordinatorLayout
import android.util.AttributeSet
import io.rover.app.experiences.R

/**
 *
 */
class ExperiencesListFilterTabView(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
): CoordinatorLayout(context, attrs, defStyleAttr) {
    constructor(context: Context) : this(context, null, 0)
    constructor(context: Context, attrs: AttributeSet?) : this(context, attrs, 0)

    init {
        // TODO: this won't do.  I need to communicate between friggen
        inflate(context, R.layout.activity_experiences_list, this)
    }
}