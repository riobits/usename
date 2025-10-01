import chalk from 'chalk'
import inquirer from 'inquirer'
import { createSpinner } from 'nanospinner'

const availableMessage = (exists: boolean) => {
  return exists ? chalk.red('Taken') : chalk.green('Not Taken')
}

const getUserInput = async () => {
  const input = await inquirer.prompt({
    name: 'package_name',
    type: 'input',
    message: 'Which package name are you looking for?',
  })
  return input.package_name.trim()
}

/**
 * Runs the CLI tool to check whether a package or organization name is taken.
 *
 * @param packageName - Optional package name to check. If not provided, the user will be prompted.
 * @param showExitMsg - Whether to show how to exit the CLI. Default is false.
 * @returns An object containing `orgTaken` and `packageTaken` booleans, or `null` if an error occurred or input was empty.
 */
export const runCLI = async (
  packageName?: string,
  showExitMsg: boolean = false
) => {
  if (!packageName) {
    packageName = await getUserInput()
  }

  if (!packageName) {
    console.log(chalk.red('❌ Package name cannot be empty.'))
    return null
  }

  if (packageName.toLowerCase() === 'exit') {
    console.log(chalk.green('👋 Goodbye!'))
    process.exit(0)
  }

  console.log(chalk.blue(`\n🔍 Searching for "${packageName}"...\n`))
  if (showExitMsg) {
    console.log(chalk.gray('Press Ctrl+C or write "exit" to exit\n'))
  }

  try {
    const { orgTaken, packageTaken } = await searchForPackage(packageName)
    console.log(`🌐 Organization  : ${availableMessage(orgTaken)}`)
    console.log(`📦 Package       : ${availableMessage(packageTaken)}`)
    return { orgTaken, packageTaken }
  } catch {
    console.log(
      chalk.yellow('⚠️ Something went wrong. Please try again later.')
    )
    return null
  }
}

/**
 * Checks if an npm package name and organization name are already taken.
 *
 * @param name - The package or organization name to check.
 * @returns An object with two boolean properties:
 *          - `orgTaken`: true if the organization name exists.
 *          - `packageTaken`: true if the package name exists.
 * @throws Will throw an error if the network request fails.
 */
export const searchForPackage = async (name: string) => {
  const spinner = createSpinner(`Checking ${name}`).start()
  try {
    const orgURL = `https://www.npmjs.com/org/${name}`
    const packageURL = `https://www.npmjs.com/package/${name}`

    const init = {
      headers: {
        accept: 'text/html',
        'accept-language': 'en-US',
        'cache-control': 'max-age=0',
      },
      method: 'GET',
    }

    const [orgResponse, packageResponse] = await Promise.all([
      fetch(orgURL, init),
      fetch(packageURL, init),
    ])

    spinner.stop()

    const orgTaken = orgResponse.status === 200
    const packageTaken = packageResponse.status === 200

    return { orgTaken, packageTaken }
  } catch (err) {
    spinner.stop()
    throw err
  }
}
