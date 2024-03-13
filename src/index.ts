import TelegramBot from 'node-telegram-bot-api'
import {writeFileSync} from 'fs'

const token = ''
const bot = new TelegramBot(token)

const DEFAULT_CITY_ID = '3205200' // Vila Velha

const getImage = async (cityId: string) => {
  const now = new Date()
  const date = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`
  console.log(cityId, date)
  const response = await fetch(`https://apiprevmet3.inmet.gov.br/meteograma/${cityId}/${date}/12`)
  if (!response.ok){
    throw new Error('Erro ao buscar imagem')
  }
  const result = await response.json() as any


  return result.base64.replace(/^data:image\/png;base64,/, "");
}

bot.onText(/\/meteograma/, async (msg) => {
  const chatId = msg.chat.id
  const args = msg.text?.split(' ')||[]
  const b64 = await getImage(args.length > 1 ? args[1] : DEFAULT_CITY_ID )
  writeFileSync('out.png', b64, 'base64')
  bot.sendPhoto(chatId, 'out.png')
})

bot.startPolling()
