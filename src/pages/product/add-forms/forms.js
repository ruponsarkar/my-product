import React, { useState, useEffect } from "react";
import { post_form_attributes, get_form_attributes } from "../../../api/services/form/add-form";


export default function Forms() {
    const [formData, setFormData] = useState({
        name: "",
        label: "",
        type: "",
        cssClass: "",
        eventKey: "",
        placeholder: "",
        value: "",
        options: [],
        required: false,
        order: 0,

    });

    const [selectValue, setSelectValue] = useState([]);

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

        get_attributes();
        // 👉 you can send this to API here
    };








    return (
        <div>



            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Label</th>
                        <th>Type</th>
                        <th>Css Class</th>
                        <th>Required</th>
                        <th>Order</th>
                    </tr>
                </thead>
                <tbody>
                    {formAttributes.map((formAttribute) => (
                        <tr key={formAttribute._id}>
                            <td>{formAttribute.name}</td>
                            <td>{formAttribute.label}</td>
                            <td>{formAttribute.type}</td>
                            <td>{formAttribute.cssClass}</td>
                            <td>{formAttribute.required ? "Yes" : "No"}</td>
                            <td>{formAttribute.order}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <br />
            <br />
            <br />
            <br />
            <br />
            <hr />


            <form className="row" onSubmit={handleSubmit}>
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
                    {/* <input
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-control col-12 mb-2"
          /> */}

                    <select name="type" value={formData.type} onChange={handleChange} className="form-control col-12 mb-2" id="">
                        <option value="text">text</option>
                        <option value="number">number</option>
                        <option value="select">select</option>
                        <option value="textarea">textarea</option>
                        <option value="checkbox">checkbox</option>
                        <option value="radio">radio</option>
                        <option value="rich-text">rich-text</option>
                    </select>
                </div>

                {formData.type === "select" && (
                    <>
                        <div className="col-md-5">
                            <label htmlFor="value">Options</label>
                            <input
                                type="text"
                                placeholder="value"
                                id="value"
                                name="options.value"
                                // value={formData.value}
                                onChange={handleChange}
                                className="form-control col-6 mb-2"
                            />
                            <input
                                type="text"
                                id="value"
                                name="options.label"
                                placeholder="label"
                                // value={formData.value}
                                onChange={handleChange}
                                className="form-control col-6 mb-2"
                            />
                            <button className="btn btn-primary btn-sm">+ Add</button>
                        </div>

                        <div>
                            {formData.options.length && (
                                <>
                                <div>

                                </div>
                                </>
                            )}
                        </div>
                    </>
                )}


                {/* <div className="col-md-5">
          <label htmlFor="options">Options (comma separated)</label>
          <input
            type="text"
            id="options"
            name="options"
            value={formData.options}
            onChange={handleChange}
            className="form-control col-12 mb-2"
          />
        </div> */}



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
            </form>
        </div>
    );
}
