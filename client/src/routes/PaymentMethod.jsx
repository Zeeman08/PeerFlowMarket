import React, { useState, useEffect } from 'react';
import { useData } from '../context/PersonContext';


    const PaymentMethod = () => {
        const [selectedOption, setSelectedOption] = useState('');

        const handleOptionChange = (event) => {
            setSelectedOption(event.target.value);
        };

        return (
            <div>
                <label htmlFor="paymentMethod">Payment Method:</label>
                <select id="paymentMethod" value={selectedOption} onChange={handleOptionChange}>
                    <option value="creditCard">Credit Card</option>
                    <option value="debitCard">Debit Card</option>
                    <option value="cashOnDelivery">Cash on Delivery</option>
                </select>
            </div>
        );
    };
    

export default PaymentMethod;