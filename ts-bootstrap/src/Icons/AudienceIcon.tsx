/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default () => (
    <svg width="72" height="72">
        <defs>
            <path
                d="M5 0h62a5 5 0 0 1 5 5v62a5 5 0 0 1-5 5H5a5 5 0 0 1-5-5V5a5 5 0 0 1 5-5z"
                id="audience-icon-path-1"
            />
        </defs>
        <g fill="none" fillRule="evenodd">
            <mask id="audience-icon-mask" fill="#fff">
                <use xlinkHref="#audience-icon-path-1" />
            </mask>
            <use
                fill="#8357D6"
                fillRule="nonzero"
                xlinkHref="#audience-icon-path-1"
            />
            <path
                d="M33.209 42.792c-.602-.742-1.417-1.259-2.257-1.731-1.415-.795-2.85-1.554-4.405-2.09a3.872 3.872 0 0 1-.615-.28c-.789-.439-1.037-1.234-.6-1.994.178-.309.417-.589.646-.869 1.104-1.352 1.934-2.829 2.272-4.515.35-1.746.34-3.478-.497-5.121-.888-1.741-2.384-2.745-4.398-3.074a8.865 8.865 0 0 0-1.331-.117V23h-.048v.001c-.44.005-.884.045-1.33.117-2.015.33-3.51 1.333-4.399 3.074-.837 1.643-.847 3.375-.497 5.121.338 1.686 1.168 3.163 2.272 4.515.23.28.468.56.646.87.437.76.189 1.554-.6 1.992a3.872 3.872 0 0 1-.615.281c-1.556.536-2.99 1.295-4.405 2.09-.84.472-1.655.989-2.257 1.731-.818 1.01-1.019 2.134-.522 3.323.301.723.93 1.181 1.642 1.535 1.206.6 2.526.846 3.857 1.037 1.487.213 2.989.28 4.49.3.573.008 1.146.013 1.718.013h.048c.572 0 1.145-.005 1.718-.013 1.501-.02 3.003-.087 4.49-.3 1.331-.191 2.65-.436 3.857-1.037.711-.354 1.34-.812 1.642-1.535.497-1.189.296-2.312-.522-3.323"
                fill="#FFF"
                fillRule="nonzero"
                mask="url(#audience-icon-mask)"
            />
            <rect
                fill="#F2A5FA"
                fillRule="nonzero"
                mask="url(#audience-icon-mask)"
                x="37"
                y="25"
                width="24"
                height="3"
                rx=".96"
            />
            <rect
                fill="#C182EA"
                fillRule="nonzero"
                mask="url(#audience-icon-mask)"
                x="37"
                y="31"
                width="24"
                height="3"
                rx=".96"
            />
            <rect
                fill="#C182EA"
                fillRule="nonzero"
                mask="url(#audience-icon-mask)"
                x="37"
                y="37"
                width="24"
                height="3"
                rx=".96"
            />
            <rect
                fill="#C182EA"
                fillRule="nonzero"
                mask="url(#audience-icon-mask)"
                x="37"
                y="44"
                width="24"
                height="3"
                rx=".96"
            />
        </g>
    </svg>
)
