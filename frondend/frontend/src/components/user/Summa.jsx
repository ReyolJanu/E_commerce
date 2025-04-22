import React, { useState } from 'react'
import { Button } from 'react-bootstrap';

function Summa() {
    const [on , setOn] = useState(false);
    const [name , setName] = useState("");
    

    const testingBtn = () => {
        if(on === true){
            alert("hello");
            setName("Jhon!")
        }else{
            alert('please tick the check box!') 
        }
    }

    const checkBtn = (e) => {
        setOn(e.target.checked)
    }
    return (
       

            <div className='flex flex-col space-y-2'>
                    <div><input type='checkbox' checked={on} onChange={checkBtn}/> <span>I accept this term and conditions</span></div>
                    <Button onClick={testingBtn} disabled={!on} className='w-[100px]'>Confirm</Button>
                    <input className='w-[150px] border-2 border-gray-500' value={name}/>
            </div>

    )
}

export default Summa
