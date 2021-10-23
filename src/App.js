import React from 'react';

import copy from 'copy-to-clipboard';
import cloneDeep from 'lodash/cloneDeep';

import './App.css';

const INPUT_TYPE = {
    PASSWORD: 'PASSWORD',
    TEXT: 'TEXT'
}

function PasswordInput(props) {
    const [type, setType] = React.useState(INPUT_TYPE.PASSWORD);

    return (
        <>
            <input type={type} {...props} />
            <button
                onClick={() => {
                    setType(type === INPUT_TYPE.PASSWORD ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD)
                }}
            >
                =
            </button>
        </>
    )
}

const STORAGE_KEYS = {
    INPUT: 'input/v0.1'
}

function App() {
    const [parsedData, setParsedData] = React.useState([
        {
            serviceName: 'YouTube',
            creds: [
                {
                    login: 'log',
                    password: 'pass',
                },
                {
                    login: 'log',
                    password: 'pass',
                },
            ],
        },
    ]);

    const handleChangeCred = (serviceIndex, credIndex, login, password) => {
        const clonedParsedData = cloneDeep(parsedData);
        clonedParsedData[serviceIndex].creds[credIndex] = {
            login,
            password,
        }
        setParsedData(clonedParsedData);
    }

    const handleChangeServiceName = (serviceIndex, name) => {
        const clonedParsedData = cloneDeep(parsedData);
        clonedParsedData[serviceIndex].serviceName = name;
        setParsedData(clonedParsedData);
    }

    const handleDeleteCred = (serviceIndex, credIndex) => {
        const clonedParsedData = cloneDeep(parsedData);
        clonedParsedData[serviceIndex].creds.splice(credIndex, 1);
        setParsedData(clonedParsedData);
    }

    const handleAddCred = (serviceIndex) => {
        const clonedParsedData = cloneDeep(parsedData);
        clonedParsedData[serviceIndex].creds.push({
            login: "",
            password: "",
        });
        setParsedData(clonedParsedData);
    }


    const handleAddService = () => {
        const clonedParsedData = cloneDeep(parsedData);
        clonedParsedData.push({
            serviceName: '',
            creds: []
        });
        setParsedData(clonedParsedData);
    }

    const [inputText, setInputText] = React.useState(localStorage.getItem(STORAGE_KEYS.INPUT) || "");
    const [masterPassword, setMasterPassword] = React.useState("");

    const handleChangeInputText = (value) => {
        localStorage.setItem(STORAGE_KEYS.INPUT, value);
        setInputText(value);
    }

    React.useEffect(() => {
        console.log(inputText);
    }, [inputText, masterPassword]);

    return (
        <div className="App">
            <div className="row">
                <textarea
                    placeholder="encrypted data"
                    className="textarea"
                    value={inputText}
                    onChange={event => handleChangeInputText(event.currentTarget.value)}
                />
                <button
                    onClick={() => {
                        copy(inputText);
                    }}
                >
                    copy
                </button>
            </div>
            <br/>
            <div>
                <div>Master password</div>
                <PasswordInput
                    value={masterPassword}
                    onChange={event => setMasterPassword(event.currentTarget.value)}
                ></PasswordInput>
            </div>
            <br/>
            <hr/>
            <br/>
            <div>
                {parsedData.map((serviceData, serviceIndex) => {
                    return (
                        <div key={serviceIndex}>
                            <input
                                className={"service-name"}
                                placeholder={"Service name"}
                                value={serviceData.serviceName}
                                onChange={(event) => {
                                    handleChangeServiceName(serviceIndex, event.currentTarget.value);
                                }}
                            />
                            <br/>
                            <br/>
                            <div>
                                {serviceData.creds.map((cred, credIndex) => {
                                    return (
                                        <div key={credIndex} className={'row'}>
                                            <input
                                                className="login"
                                                placeholder={"login"}
                                                value={cred.login}
                                                onChange={(event) => {
                                                    handleChangeCred(serviceIndex, credIndex, event.currentTarget.value, cred.password);
                                                }}
                                            />
                                            <button
                                                onClick={() => {
                                                    copy(cred.login);
                                                }}
                                            >
                                                copy
                                            </button>
                                            <div className="row-space"/>

                                            <PasswordInput
                                                placeholder={"password"}
                                                className="password"
                                                value={cred.password}
                                                onChange={(event) => {
                                                    handleChangeCred(serviceIndex, credIndex, cred.login, event.currentTarget.value);
                                                }}
                                            />
                                            <button
                                                onClick={() => {
                                                    copy(cred.password);
                                                }}
                                            >
                                                copy
                                            </button>
                                            <div className="row-space"/>
                                            <button
                                                onClick={() => handleDeleteCred(serviceIndex, credIndex)}
                                            >X
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                            <div>
                                <button onClick={() => handleAddCred(serviceIndex)}>add cred</button>
                            </div>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                        </div>
                    )
                })}
                <div>
                    <button onClick={() => handleAddService()}>
                        add service
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
