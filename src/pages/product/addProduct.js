import React, { useState } from 'react'
import Input from '../../components/form/input'
import JoditEditorComponent from '../../components/form/JoditEditorComponent'
import JoditEditorAuto from '../../components/form/JoditEditorAuto';

export default function AddProduct() {

    const [editorContent, setEditorContent] = useState("");

    const handleContent = (content) => {
        console.log(content);
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
                <Input label={'Product name'} />
            </div>

            <div>
                <JoditEditorAuto
                    value={editorContent}
                    onChange={(newContent) => handleContent(newContent)}
                />
            </div>
            {/* <div>
                <JoditEditorComponent
                    value={editorContent}
                    onChange={(newContent) => setEditorContent(newContent)}
                />
            </div> */}

            <div>
                <button className='btn btn-success' onClick={onSave}>Save</button>
            </div>
        </div>
    )
}
