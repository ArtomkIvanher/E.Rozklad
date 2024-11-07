import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import s from './Main.module.scss'

export default function Main() {
	return (
		<div className={s.main}>
			<h1>
				<span>Main</span>
				<span>
					<p><Link to="/login">login</Link></p>
					<p><Link to="/signup">signup</Link></p>
					<p><Link to="/main">Main</Link></p>
					<p><Link to="/main/home">Home</Link></p>
					<p><Link to="/main/home2">Home2</Link></p>
					<p><Link to="/main/home3">Home3</Link></p>
				</span>
				<Outlet />
			</h1>
		</div>
	)
}
