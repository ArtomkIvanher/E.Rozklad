import { Navigate } from 'react-router-dom'

import SignUp from '../components/pages/auth/SignUp'
import SignIn from '../components/pages/auth/SignIn'
import Home from '../components/pages/main/Home/Home'
import Home2 from '../components/pages/main/Home2/Home2'
import Home3 from '../components/pages/main/Home3/Home3'
import Main from '../components/pages/main/Main/Main'

export const routesList = [
	{
		path: '/',
		element: <Navigate to='/main' />,
	},
	{
		path: '/signup',
		element: <SignUp />,
	},
	{
		path: '/signin',
		element: <SignIn /> ,
	},
	{
		path: 'main',
		element: <Main />,
		children: [
			{ path: 'home', element: <Home /> },
			{ path: 'home2', element: <Home2 /> },
			{ path: 'home3', element: <Home3 /> },
		],
	},
]
