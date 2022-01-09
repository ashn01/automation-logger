import axios from 'axios';
import React, {useState} from 'react';
import { useEffect } from 'react';
import { Table } from 'react-bootstrap';

import '../../css/home.css'

export default function Home() {
    const [testCases, setTestCases] = useState<Array<any>>();

    useEffect(()=>{
        console.log("get")
        axios.get(`/all`)
        .then((res=>{
            console.log(res)
            setTestCases(res.data);
        }))
        .catch(err=>{
            console.log(err)
        })
    },[])

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th rowSpan={2}>
                        Number
                    </th>
                    <th rowSpan={2}>
                        Test name
                    </th>
                    <th colSpan={2}>
                        Current
                    </th>
                    <th rowSpan={2}>
                        Recent pass
                    </th>
                    <th rowSpan={2}>
                        Recent fail
                    </th>
                </tr>
                <tr>
                    <th>Status</th>
                    <th>Version</th>
                </tr>
            </thead>
            <tbody>
                {
                    testCases && testCases.map((test,key)=>{
                        return(
                            <tr key={key}>
                                <td>{test.id}</td>
                                <td>{test.name}</td>
                                <td className={`${test.c_status!==null?(test.c_status===1?"pass":"fail"):"na"}`}>{test.c_status!==null?(test.c_status===1?"PASS":"FAIL"):"N/A"}</td>
                                <td>{test.c_version!==null?test.c_version:"N/A"}</td>
                                <td>{test.r_pass!==null?test.r_pass:"N/A"}</td>
                                <td>{test.r_fail!==null?test.r_fail:"N/A"}</td>
                            </tr>
                        )
                    })
                    
                }
            </tbody>
        </Table>
    );
}