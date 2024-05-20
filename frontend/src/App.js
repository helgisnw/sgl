import logo from "./logo.png";
import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
    return (
        <div className="App">
            <Header />
            <Body />
            <Footer />
        </div>
    );
}

function Body() {
    let [today, setToday] = useState("");
    let [meal, setMeal] = useState("");
    let [cal, setCal] = useState("");
    let [mealType, setMealType] = useState(0);

    function getMeal(today) {
        fetch(`/meal?today=${today}`)
            .then((res) => res.json())
            .then(({ meal, cal }) => {
                setMeal(meal);
                setCal(cal);
            });
    }

    useEffect(() => {
        const { today } = getDates();
        setToday(today);
        getMeal(today);
    }, []);

    const handleButtonClick = (e, type) => {
        setMealType(type);
        const buttons = document.querySelectorAll('.meal-type-button');
        buttons.forEach(button => button.classList.remove('active'));
        e.target.classList.add('active');
    };

    return (
        <div className="App-body">
            <div className="meal">
                <div className="meal-title">
                    <div className="meal-title-date">
                        <button
                            onClick={() => {
                                const { yesterday } = getDates(today);
                                setToday(yesterday);
                                getMeal(yesterday);
                            }}
                        >
                            <i className="bi bi-caret-left-fill"></i>
                        </button>
                        <p>
                            {today.slice(0, 4)}년 {today.slice(4, 6)}월{" "}
                            {today.slice(6)}일 ({getDayOfWeek(today)})
                        </p>
                        <button
                            onClick={() => {
                                const { tomorrow } = getDates(today);
                                setToday(tomorrow);
                                getMeal(tomorrow);
                            }}
                        >
                            <i className="bi bi-caret-right-fill"></i>
                        </button>
                    </div>
                </div>
                <div className="meal-type-selector">
                    <button
                        className={`meal-type-button ${mealType === 0 ? 'active' : ''}`}
                        onClick={(e) => handleButtonClick(e, 0)}
                    >
                        조식
                    </button>
                    <button
                        className={`meal-type-button ${mealType === 1 ? 'active' : ''}`}
                        onClick={(e) => handleButtonClick(e, 1)}
                    >
                        중식
                    </button>
                    <button
                        className={`meal-type-button ${mealType === 2 ? 'active' : ''}`}
                        onClick={(e) => handleButtonClick(e, 2)}
                    >
                        석식
                    </button>
                </div>
                <div className="meal-content">
                    <div className="meal-content-meal">
                        <h2>급식</h2>
                        {meal ? (
                            meal[mealType].map((element, index) => {
                                return (
                                    <div
                                        className="meal-content-meal-element"
                                        key={index}
                                    >
                                        <p key={index}>{element}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <p>오늘은 급식이 없습니다</p>
                        )}
                    </div>
                    <div className="meal-content-cal">
                        <h2>칼로리</h2>
                        {cal ? (
                            <p>{cal[mealType]}</p>
                        ) : (
                            <p>오늘은 급식이 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Header() {
    return (
        <div className="App-header">
            <h1>서울국제고 급식</h1>
        </div>
    );
}

function Footer() {
    return (
        <div className="App-footer">
            <p className="copyright">&copy; 2024 helgisnw</p>
        </div>
    );
}

function getDates(dateString = "") {
    const date = dateString
        ? new Date(
              dateString.slice(0, 4),
              dateString.slice(4, 6) - 1,
              dateString.slice(6)
          )
        : new Date();
    const yesterday = new Date(date.setDate(date.getDate() - 1));
    const today = new Date(date.setDate(date.getDate() + 1));
    const tomorrow = new Date(date.setDate(date.getDate() + 1));
    return {
        yesterday: `${yesterday.getFullYear()}${(
            "0" +
            (yesterday.getMonth() + 1)
        ).slice(-2)}${("0" + yesterday.getDate()).slice(-2)}`,
        today: `${today.getFullYear()}${("0" + (today.getMonth() + 1)).slice(
            -2
        )}${("0" + today.getDate()).slice(-2)}`,
        tomorrow: `${tomorrow.getFullYear()}${(
            "0" +
            (tomorrow.getMonth() + 1)
        ).slice(-2)}${("0" + tomorrow.getDate()).slice(-2)}`,
    };
}

function getDayOfWeek(dateString) {
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const year = dateString.slice(0, 4);
    const month = Number(dateString.slice(4, 6)) - 1;
    const day = dateString.slice(6, 8);
    const date = new Date(year, month, day);
    const dayOfWeekIndex = date.getDay();
    return daysOfWeek[dayOfWeekIndex];
}

export default App;
