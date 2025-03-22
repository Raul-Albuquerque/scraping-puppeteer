// routes/utmify.ts
import { Router, Request, Response } from 'express';
import puppeteerExtra from 'puppeteer-extra';
import puppeteerExtraPluginStealth from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';
import { generateUrlWithProducts } from '../utils/helpers';

dotenv.config();

const router = Router();

const login = process.env.UTM_LOGIN;
let password = process.env.UTM_PASSWORD;
const link = process.env.UTM_LINK;

if (!login || !password || !link) {
  console.error('Erro: Variáveis de ambiente não configuradas corretamente!');
  process.exit(1);
}

password = password + '#';

puppeteerExtra.use(puppeteerExtraPluginStealth());

router.get("/:day", async (req: Request, res: Response) => {
  const { day } = req.params;
  const adsTableUrl = generateUrlWithProducts({ day });

  let browser;

  try {
    browser = await puppeteerExtra.launch({ headless: false });
    const page = await browser.newPage();
    
    await page.goto(link);
    await page.type('input[name="email"]', login);
    await page.type('input[name="password"]', password);
    await page.keyboard.press("Enter");

    await page.waitForNavigation({ waitUntil: "networkidle2" });

    await page.goto(adsTableUrl);
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });  // Certifique-se de enviar o erro como mensagem
  }
});


export default router;
