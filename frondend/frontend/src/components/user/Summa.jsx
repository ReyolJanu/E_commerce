import React, { useState } from 'react'

function Summa() {
    const [nameList, setNameList] = useState([]);
    const [name, setName] = useState("");

    const saveButton = ()=>{
        setNameList([...nameList, name]);
        setName("");
    }
    return (
        <div className='p-10'>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='border-2 rounded-[5px]' />
            <button onClick={saveButton} type='button' className='bg-green-500 border-1'>Add</button>
            <div>
                <span>
                    {nameList.map((name, index) => {
                       return <div key={index}>{name}</div>
                    })}

                </span>
            </div>

        </div>
    )
}

export default Summa
