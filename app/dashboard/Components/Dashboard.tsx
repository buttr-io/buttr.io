"use client"

import { getUsersBrand } from "@/app/services/user/user";
import { useEffect, useState } from "react";

type Brand = {
    id: string
    name: string
}

const Dashboard = () => {
    const [brands, setUserBrands] = useState([]);

    useEffect(() => {
        getUsersBrand().then((userBrands) => {
            setUserBrands(userBrands)
        })
    },[])

    return (
    <>
        <>You Can view dashboard</>
        
        List of User's brands:
        <ul>{brands.map((brand: Brand) => {
            return <li key={brand.id}>{brand.name}</li>
        })}
        </ul>
    </>
    )
}
export default Dashboard;