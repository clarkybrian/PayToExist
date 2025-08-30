import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

export default stripePromise

export const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/9B66oGeCW1MkfKmbC3cV203'
export const PRICE_ID = 'price_1S1glxBGLhOquLjYwiviJhw5'
