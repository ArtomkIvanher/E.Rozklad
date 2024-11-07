import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { routesList } from './routes'

export const MyAppRouter = () => (
	<RouterProvider
		router={createBrowserRouter(routesList, { basename: '/E.Rozklad' })}
	/>
)
