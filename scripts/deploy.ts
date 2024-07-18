import { deployMe } from './common/deploy'

deployMe().then(function() {
    process.exit(0)
})