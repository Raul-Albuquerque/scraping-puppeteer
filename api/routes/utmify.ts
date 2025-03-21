import puppeteerExtra from 'puppeteer-extra';
import puppeteerExtraPluginStealth from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';
import { Router } from 'express';

import { generateUrlWithProducts } from '../utils/helpers';

dotenv.config();
const router = Router();

const login = process.env.UTM_LOGIN || '';
let password = process.env.UTM_PASSWORD || '';
password = password + '#'
const link = process.env.UTM_LINK || '';

// Ativando o plugin stealth
puppeteerExtra.use(puppeteerExtraPluginStealth());

router.get("/utmify/:day", async (req,res) => {
  const { day } = req.params;
  const adsTableUrl = generateUrlWithProducts({ day });

  try {
    // Inicializando o browser com puppeteer-extra
    const browser = await puppeteerExtra.launch({ headless: false }); // Define como false para visualizar o processo
    const page = await browser.newPage();
    await page.goto("https://app.utmify.com.br/login/");
    await page.type('input[name="email"]', login);
    await page.type('input[name="password"]', password);
    await page.keyboard.press("Enter");
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    // await page.screenshot({ path: "login.png" });
    await page.goto(adsTableUrl);
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    // await page.screenshot({ path: "dash.png" });

    await browser.close();

  } catch (error) {
    console.log(error);
  }
});

export default router;
