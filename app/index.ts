import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { PORT } from '~consts'
import { routes, socketIO } from '~routes'

//→ HONO SERVER

const app = new Hono()

//→ LOAD SERVER CONFIG

app.use(cors())

app.use(logger())

//→ LOAD ROUTES

app.route('/', routes)

//→ RUN SERVER

const server = serve(
	{
		fetch: app.fetch,
		port: PORT,
	},
	(info) => {
		console.log(`Server is running: http://localhost:${info.port}`)
	}
)

//→ SOCKET IO SERVER

socketIO(server)
