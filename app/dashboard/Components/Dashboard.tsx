"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { getUsersBrand, logout } from "@/app/services/client-side-serivices/user/user";

type Brand = {
    id: string
    name: string
}

const Dashboard = () => {
    const [brands, setUserBrands] = useState([]);

    useEffect(() => {
        console.log("Getting user brands")
        getUsersBrand().then((userBrands) => {
            setUserBrands(userBrands)
        })
    },[])

    return (
    <>
        <>You Can view dashboard</>
        
        List of User's brands:
        <ul>{brands && brands.map((brand: Brand) => {
            return <li key={brand.id}>{brand.name}</li>
        })}
        
        <button onClick={logout}> 
            Logout
        </button>
        </ul>
    </>
    )
}

export default Dashboard;