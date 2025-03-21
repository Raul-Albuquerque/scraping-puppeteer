import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import { Router } from 'express';

dotenv.config();
const router = Router();

const login = process.env.UTM_LOGIN || '';
const password = process.env.UTM_PASSWORD || '';
const link = process.env.UTM_LINK || '';
const utmDashAutomacao = process.env.UTM_DASH_AUTOMACAO || '';

router.get('/utmify/:day', async (req, res) => {
  const { day } = req.params;
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(link, { waitUntil: 'networkidle2' });

  await page.type('input[name="email"]', login);
  await page.type('input[name="password"]', password);
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);
  console.log('✅ Login realizado com sucesso!');

  await page.goto(utmDashAutomacao, { waitUntil: 'networkidle2' });

  await page.waitForSelector('button:nth-child(4)', { visible: true });
  await page.click('button:nth-child(4)');
  console.log('✅ Dash de Anúncios acessado com sucesso!');

  if (day === 'yesterday') {
    await page.waitForSelector('.select2-selection', { visible: true });
    await page.click('.select2-selection');

    await page.waitForSelector('.select2-results__option', { visible: true });

    const options = await page.$$('.select2-results__option');
    for (const option of options) {
      const text = await page.evaluate(el => el.textContent, option);
      if (text === 'Ontem') {
        await option.click();
        console.log('✅ Selecionado o dia de ontem com sucesso!');
        break;
      }
    }
  }

  await page.waitForSelector('.table', { visible: true });
  const tableData: string[][] = [];

  const rows = await page.$$('.table tr');
  for (const row of rows) {
    const cols = await row.$$('td, th');
    const rowData = [];
    for (const col of cols) {
      const text = await page.evaluate(el => el.textContent?.trim(), col);
      rowData.push(text || '');
    }
    tableData.push(rowData);
  }

  console.log('✅ Relatório carregado com sucesso!');
  await browser.close();

  res.json({ status: 'Sucesso', data: tableData });
});

export default router;
