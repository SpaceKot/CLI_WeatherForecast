#!/usr/bin/env node
// node weather.js -s ГОРОД
// node weather.js -t a1b2c3d4e5f6789012345678901234567

//rm ~/weather-data.json УДАЛИТЬ ФАЙЛ КОНФИГУРАЦИИ
//node weather.js -t НОВЫЙ_ТОКЕН -s НОВЫЙ_ГОРОД
//ПОСМОТРЕТЬ ГОРОД И ТОКЕН  cat ~/weather-data.json
import { getArgs } from './helpers/args.js';
import { getWeather, getIcon } from './services/api.service.js';
import { printHelp, printSuccess, printError, printWeather } from './services/log.service.js';
import { saveKeyValue, TOKEN_DICTIONARY, getKeyValue } from './services/storage.service.js';


const saveToken = async (token) => {
    if (!token.length) {
        printError('Не передан token');
        return;
    }

    try {
        await saveKeyValue(TOKEN_DICTIONARY.token, token);
        printSuccess('Токен сохранён')
    }
    catch (e) {
        printError(e.message);
    }
}


const saveCity = async (city) => {
    if (!city.length) {
        printError('Не передан город');
        return;
    }

    try {
        await saveKeyValue(TOKEN_DICTIONARY.city, city);
        printSuccess('город сохранён')
    }
    catch (e) {
        printError(e.message);
    }
}



const getForecast = async () => {
    try {
        const city = process.env.CITY ?? await getKeyValue(TOKEN_DICTIONARY.city);
        const weather = await getWeather(city);
        printWeather(weather, getIcon(weather.weather[0].icon));
    }
    
    catch (e) {
        if (e?.response?.status == 404) {
            printError('Неверно указан город');
        }
        else if (e?.response?.status == 401) {
            printError('Неверно указан токен');
        }
        else {
            printError(e.message);
        }
    }
};


const initCLI = () => {
    const args = getArgs(process.argv);

    if (args.h) {
        return printHelp();
    }
    if (args.s) {
        return saveCity(args.s);
    }
    if (args.t) {
        return saveToken(args.t);
    }
    return getForecast();
    
};

initCLI();