import axios from "axios";

const api_key = 'AIzaSyA4UrUEvs0vZR1JZ4QvjXXIc5RiFN9WOfY';
const firebaseUrl = "https://svijetknjiga-df663-default-rtdb.europe-west1.firebasedatabase.app/";

const registerFbUser = async (email, password) => {
    const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${api_key}`;
    return await axios.post(endpoint, {
        email,
        password,
        returnSecureToken: true,
    });
};

const loginFbUser = async (email, password) => {
    const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${api_key}`;
    return await axios.post(endpoint, {
        email,
        password,
        returnSecureToken: true,
    });
};

const saveFbObject= async (table, objectForSave, userId, token) => {
    const endpoint = `${firebaseUrl}/${table}.json?auth=${token}`;
    return await axios.post(endpoint, {
        ...objectForSave,
        userId: userId,
    });
};

const getUserFbObjects = async (table, token, userId) => {
    const endpoint = `${firebaseUrl}/${table}.json?orderBy="userId"&equalTo="${userId}"&auth=${token}&print=pretty`;
    let result = await axios.get(endpoint);
    if(result.data == null){
        return []
    }
    let resultArray = Object.entries(result.data);

    let documentsArray = [];
    resultArray.map((item) =>
        documentsArray.push({
            id: item[0],
            ...item[1],
        })
    );

    return documentsArray;
};

const getAllFbObjects = async (table, token) => {
    const endpoint = `${firebaseUrl}/${table}.json?auth=${token}`;
    let result = await axios.get(endpoint);
    if(result.data == null){
        return []
    }
    let resultArray = Object.entries(result.data);
    let documentsArray = [];
    resultArray.map((item) =>
        documentsArray.push({
            id: item[0],
            ...item[1],
        })
    );
    return documentsArray;
}

const getAllFbObjectsNoAuth = async (table) => {
    const endpoint = `${firebaseUrl}/${table}.json`;
    let result = await axios.get(endpoint);
    if(result.data == null){
        return []
    }
    let resultArray = Object.entries(result.data);
    let documentsArray = [];
    resultArray.map((item) =>
        documentsArray.push({
            id: item[0],
            ...item[1],
        })
    );
    console.log(table, documentsArray)
    return documentsArray;
}

const editFbObject = async (table, newObject, id, token) => {
    const endpoint = `${firebaseUrl}/${table}/${id}.json?auth=${token}`;
    return await axios.put(endpoint, {
        ...newObject,
    });
};

const deleteFbObject = async (table, objectId, token) => {
    const endpoint = `${firebaseUrl}/${table}/${objectId}.json?auth=${token}`;
    return await axios.delete(endpoint);
};

export { 
    saveFbObject,
    getAllFbObjects,
    editFbObject,
    deleteFbObject,
    getUserFbObjects,
    registerFbUser,
    loginFbUser,
    api_key,
    firebaseUrl,
    getAllFbObjectsNoAuth
};
