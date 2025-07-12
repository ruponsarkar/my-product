import React, { useState } from 'react'
import Input from '../../components/form/input'
import JoditEditorComponent from '../../components/form/JoditEditorComponent'

export default function AddProduct() {

    const [editorContent, setEditorContent] = useState("");

    const handleContent = (content) => {
        setEditorContent(content);
    };

    const onSave = () => {
        console.log(editorContent);
    };

    return (
        <div>
            <div>
                <Input label={'Product name'} />
            </div>

            <div>
                <JoditEditorComponent
                    value={editorContent}
                    onChange={(newContent) => setEditorContent(newContent)}
                />
            </div>

            <div>
                <button onClick={onSave}>Save</button>
            </div>
        </div>
    )
}
