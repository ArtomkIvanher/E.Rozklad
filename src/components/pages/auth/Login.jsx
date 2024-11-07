import { Link } from 'react-router-dom'
import s from './Login.module.scss'

export default function Login() {
	return (
		<div className={s.login}>
			<h1>
				<span>Login</span>
				<span>
					<p><Link to="/login">login</Link></p>
					<p><Link to="/signup">signup</Link></p>
					<p><Link to="/main">Main</Link></p>
					<p><Link to="/main/home">Home</Link></p>
					<p><Link to="/main/home2">Home2</Link></p>
					<p><Link to="/main/home3">Home3</Link></p>
				</span>
			</h1>
		</div>
	)
}
