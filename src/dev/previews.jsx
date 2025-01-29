import React from 'react'
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import TeacherRating from "../componenta/TeacherRating/TeacherRating";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/TeacherRating">
                <TeacherRating/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews