import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)

    const { error: err } = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password)

    setLoading(false)

    if (err) {
      setError(err.message)
    } else if (mode === 'register') {
      setInfo('Account aangemaakt. Controleer je e-mail om te bevestigen, of log direct in.')
      setMode('login')
    }
  }

  return (
    <div className="min-h-screen bg-noir-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo / titel */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-cream-100 mb-1">Dagboek</h1>
          <p className="text-cream-400 text-sm">Persoonlijk inzicht</p>
        </div>

        <div className="bg-noir-900 border border-noir-700 rounded-2xl p-6">
          <h2 className="font-display text-xl text-cream-100 mb-6">
            {mode === 'login' ? 'Inloggen' : 'Account aanmaken'}
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-300 text-sm">
              {error}
            </div>
          )}
          {info && (
            <div className="mb-4 p-3 rounded-lg bg-green-900/30 border border-green-700 text-green-300 text-sm">
              {info}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-cream-300 text-sm mb-1.5">E-mailadres</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-noir-800 border border-noir-600 rounded-lg px-3 py-2.5 text-cream-100 placeholder-cream-600 text-sm focus:outline-none focus:border-amber/60 transition-colors"
                placeholder="jouw@email.nl"
              />
            </div>

            <div>
              <label className="block text-cream-300 text-sm mb-1.5">Wachtwoord</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={6}
                className="w-full bg-noir-800 border border-noir-600 rounded-lg px-3 py-2.5 text-cream-100 placeholder-cream-600 text-sm focus:outline-none focus:border-amber/60 transition-colors"
                placeholder="Minimaal 6 tekens"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber hover:bg-amber/90 disabled:bg-amber/40 text-noir-950 font-semibold rounded-lg py-2.5 text-sm transition-colors"
            >
              {loading
                ? 'Bezig...'
                : mode === 'login' ? 'Inloggen' : 'Account aanmaken'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setInfo('') }}
              className="text-cream-400 hover:text-cream-200 text-sm transition-colors"
            >
              {mode === 'login'
                ? 'Nog geen account? Registreren'
                : 'Al een account? Inloggen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
