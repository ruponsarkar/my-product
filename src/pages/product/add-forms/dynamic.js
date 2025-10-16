import React, { useState, useEffect } from "react";
import { post_form_attributes, get_form_attributes } from "../../../api/services/form/add-form";

// const formAttributes =
//     [
//         {
//             "_id": "68cf6dfaca3dbf0ad9c42e4f",
//             "name": "product",
//             "label": "Product name",
//             "type": "text",
//             "cssClass": "form-control col-12 mb-2",
//             "eventKey": "handleForm",
//             "placeholder": "Ex- Phone",
//             "value": "",
//             "options": [],
//             "required": false,
//             "order": 0,
//             "isActive": true,
//             "createdAt": "2025-09-21T03:16:10.473Z",
//             "updatedAt": "2025-09-21T03:16:10.473Z",
//             "__v": 0
//         },
//         {
//             "_id": "68cf6e2eca3dbf0ad9c42e51",
//             "name": "price",
//             "label": "Price",
//             "type": "number",
//             "cssClass": "form-control col-12 mb-2",
//             "eventKey": "handleForm",
//             "placeholder": "Ex- 100",
//             "value": "",
//             "options": [],
//             "required": false,
//             "order": 0,
//             "isActive": true,
//             "createdAt": "2025-09-21T03:17:02.284Z",
//             "updatedAt": "2025-09-21T03:17:02.284Z",
//             "__v": 0
//         },
//         {
//             "_id": "68cf6e76ca3dbf0ad9c42e53",
//             "name": "description",
//             "label": "Description",
//             "type": "rich-text",
//             "cssClass": "form-control col-12 mb-2",
//             "eventKey": "",
//             "placeholder": "",
//             "value": "",
//             "options": [],
//             "required": false,
//             "order": 0,
//             "isActive": true,
//             "createdAt": "2025-09-21T03:18:14.980Z",
//             "updatedAt": "2025-09-21T03:18:14.980Z",
//             "__v": 0
//         },
//         {
//             "_id": "68cf6f01ca3dbf0ad9c42e55",
//             "name": "brand",
//             "label": "Brand",
//             "type": "select",
//             "cssClass": "form-control col-12 mb-2",
//             "eventKey": "handleForm",
//             "placeholder": "",
//             "value": "",
//             "options": [
//                 "[{value: 'Apple', label: 'Apple'}, {value: 'Samsung', label: 'Sumsung'}]"
//             ],
//             "required": false,
//             "order": 0,
//             "isActive": true,
//             "createdAt": "2025-09-21T03:20:33.227Z",
//             "updatedAt": "2025-09-21T03:20:33.227Z",
//             "__v": 0
//         }
//     ]

export default function Dynamic() {


    const [formData, setFormData] = useState({
        name: "",
        label: "",
        type: "",
        cssClass: "",
        eventKey: "",
        placeholder: "",
        value: "",
        options: "",
        required: false,
        order: 0,
    });

    const [formAttributes, setFormAttributes] = useState([]);

    useEffect(() => {
        get_attributes();
    }, []);

    const get_attributes = () => {
        get_form_attributes().then((res) => {
          setFormAttributes(res.data);
        });
      };


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data Submitted: ", formData);
        post_form_attributes(formData);
        // 👉 you can send this to API here
    };

    return (

        <div>
            {formAttributes.map((item) => {
                console.log(item.type);
                return (
                    <div className="mt-3 col-md-12">
                        <div>
                            <label>{item.label}</label>
                        </div>
                        <div>
                        {(item.type === "text" || item.type === "number") && <input label={item.label} name={item.name} className={item.cssClass} type={item.type} />}
                        {item.type === "select"  && 
                        (
                            <select name={item.name} className={item.cssClass} id="">
                                {item.options.map((option) => {
                                    return <option value={option}>{option}</option>
                                })}
                            </select>
                        )
                        }
                        </div>
                    </div>
                );
            })}



            {/* <form className="row" onSubmit={handleSubmit}>
                <div className="col-md-5">
                    <label htmlFor="name">Attribute Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control col-12 mb-2"
                    />
                </div>

                <div className="col-md-5">
                    <label htmlFor="label">Label</label>
                    <input
                        type="text"
                        id="label"
                        name="label"
                        value={formData.label}
                        onChange={handleChange}
                        className="form-control col-12 mb-2"
                    />
                </div>

                <div className="col-md-5">
                    <label htmlFor="type">Type</label>
                    <input
                        type="text"
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="form-control col-12 mb-2"
                    />
                </div>

                <div className="col-md-5">
                    <label htmlFor="cssClass">CSS Class</label>
                    <input
                        type="text"
                        id="cssClass"
                        name="cssClass"
                        value={formData.cssClass}
                        onChange={handleChange}
                        className="form-control col-12 mb-2"
                    />
                </div>

                <div className="col-md-5">
                    <label htmlFor="eventKey">Event Key</label>
                    <input
                        type="text"
                        id="eventKey"
                        name="eventKey"
                        value={formData.eventKey}
                        onChange={handleChange}
                        className="form-control col-12 mb-2"
                    />
                </div>

                <div className="col-md-5">
                    <label htmlFor="placeholder">Placeholder</label>
                    <input
                        type="text"
                        id="placeholder"
                        name="placeholder"
                        value={formData.placeholder}
                        onChange={handleChange}
                        className="form-control col-12 mb-2"
                    />
                </div>

                <div className="col-md-5">
                    <label htmlFor="value">Value</label>
                    <input
                        type="text"
                        id="value"
                        name="value"
                        value={formData.value}
                        onChange={handleChange}
                        className="form-control col-12 mb-2"
                    />
                </div>

                <div className="col-md-5">
                    <label htmlFor="options">Options (comma separated)</label>
                    <input
                        type="text"
                        id="options"
                        name="options"
                        value={formData.options}
                        onChange={handleChange}
                        className="form-control col-12 mb-2"
                    />
                </div>

                <div className="col-md-5 d-flex align-items-center">
                    <label htmlFor="required" className="me-2">
                        Required
                    </label>
                    <input
                        type="checkbox"
                        id="required"
                        name="required"
                        checked={formData.required}
                        onChange={handleChange}
                        className="form-check-input"
                    />
                </div>

                <div className="col-md-5">
                    <label htmlFor="order">Order</label>
                    <input
                        type="number"
                        id="order"
                        name="order"
                        value={formData.order}
                        onChange={handleChange}
                        className="form-control col-12 mb-2"
                    />
                </div>

                <div className="col-12 mt-3">
                    <button type="submit" className="btn btn-primary">
                        Save Attribute
                    </button>
                </div>
            </form> */}

        </div>
    )
}
