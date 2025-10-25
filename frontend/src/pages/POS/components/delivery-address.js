import React from 'react'

export default function DeliveryAddress() {

    const addresses = [
        {   id: 1,
            name: "Rupon",
            phone: "9707132913",
            pincode: "782445",
            locality: "Ambari",
            address: "Ambari",
            district: "Hojai",
            state: "Assam",
            landmark: "School",
            alternatePhone: "",
            isSelected: true
        },
        {   id: 2,
            name: "Rupon",
            phone: "9707132913",
            pincode: "782445",
            locality: "Ambari",
            address: "Ambari",
            district: "Hojai",
            state: "Assam",
            landmark: "School",
            alternatePhone: "",
            isSelected: false
        },
        {   id: 3,
            name: "Rupon",
            phone: "9707132913",
            pincode: "782445",
            locality: "Ambari",
            address: "Ambari",
            district: "Hojai",
            state: "Assam",
            landmark: "School",
            alternatePhone: "",
            isSelected: false
        },
    ]


    return (
        <div>
            {addresses.map((address, index) => (
                <div key={index} className="card mb-2 bg-light">

                    <div className="card-body d-flex gap-2">
                        <div>
                            <input type="radio" name="address" checked={address.isSelected} />
                        </div>
                        <div>
                            <strong>{address.name}</strong>

                            <div className='d-flex'>
                                <div>
                                    <>{address.address}, {address.locality}, {address.district}, {address.state}, {address.landmark} <strong>- {address.pincode} </strong></>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div>
                <button className='btn btn-primary btn-sm'>+ Add Address</button>
            </div>
        </div>
    )
}
