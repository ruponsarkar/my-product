import React, { useState, useEffect } from 'react'
import Input from '../../components/form/input'
import JoditEditorComponent from '../../components/form/JoditEditorComponent'
import JoditEditorAuto from '../../components/form/JoditEditorAuto';
import Paper from '@mui/material/Paper';
import { getFeelings, updateFeelings, getToday } from '../../api/services/feelingsServices';


export default function AddFeelings() {

    const toDay = new Date().toISOString().split("T")[0]

    const [feelings, setFeelings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [date, setDate] = useState(toDay);
    const [editorContent, setEditorContent] = useState("");

    const handleContent = (content) => {
        console.log(content);
        setEditorContent(content);
    };

    const onSave = () => {
        handleUpdateFeelings()
    };


    useEffect(()=>{
        getFeelingsData();
        handleGetToday(toDay);
    },[]);

    const getFeelingsData = () => {
        getFeelings({page, limit}).then((res)=>{
            console.log("res ", res.data.data);
            setFeelings(res.data.data);
        })
    }


    const handleUpdateFeelings = () => {
        updateFeelings({ date, content: editorContent, user_id: 1 }).then((res) => {
            console.log("res ", res);
            getFeelingsData();
        })
    }

    const handleGetToday=(date)=>{
        getToday({date}).then((res)=>{
            // console.log("res ", res?.data?.data);
            setEditorContent(res?.data?.data?.content);
        })
    }

    const handleDate = (e) => {
        const date = e.target.value;
        setDate(date);
        handleGetToday(date);

    }



    return (
        <div>

            <h1 className='text-center'>
                Feelings
            </h1>

            <div className='pb-3'>
                <Input label={'Date'} type={'date'} value={date} onChange={(e) => handleDate(e)}/>
            </div>

            <div className='pb-3'>
                <JoditEditorAuto
                    value={editorContent}
                    onChange={(newContent) => handleContent(newContent)}
                />
            </div>

            <div>
                <button className='btn btn-success' onClick={onSave}>Save</button>
            </div>

            <div className='pt-4'>
            <h2 className='text-center'>
               All Feelings
            </h2>
            </div>

            <Paper>

                {feelings.map((item) => {
                    return (
                        <div className='p-3'>
                            <div className='text-primary'> <strong> Date: {item.date} </strong> </div>
                            <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
                        </div>
                    )
                })}

                {/* <div className='p-3'>
                    <div className='text-primary'> <strong> Date: {date} </strong> </div>
                    <div dangerouslySetInnerHTML={{ __html: editorContent }}></div>
                </div> */}


            </Paper>
        </div>
    )
}
