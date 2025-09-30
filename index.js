#!/usr/bin/env node

import inquirer from 'inquirer'
import { createSpinner } from 'nanospinner'
import chalk from 'chalk'

const availableMessage = (exists) => {
  return exists ? chalk.red('Taken') : chalk.green('Not Taken')
}

const searchForPackage = async (name) => {
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

    const orgExists = orgResponse.status === 200
    const packageExists = packageResponse.status === 200

    if (orgResponse.status === 403 || packageResponse.status === 403) {
      console.log('\n')
      console.log(
        chalk.yellow('⚠️ Unauthorized request. Please try again later.')
      )
    }

    const orgExistsMsg = availableMessage(orgExists)
    const packageExistsMsg = availableMessage(packageExists)

    console.log('\n')

    if (orgExists && packageExists) {
      console.log(chalk.red('❌ Both Organization and Package are taken.'))
    } else if (!orgExists && !packageExists) {
      console.log(
        chalk.green('✅ Both Organization and Package are available.')
      )
    } else {
      console.log(`🌐 Organization  : ${orgExistsMsg}`)
      console.log(`📦 Package       : ${packageExistsMsg}`)
    }

    console.log('\n')
  } catch (err) {
    spinner.stop()
    console.log('\n')
    console.log(
      chalk.yellow('⚠️ Something went wrong. Please try again later.')
    )
    console.log('\n')
    process.exit(1)
  }
}

const getUserInput = async () => {
  while (true) {
    const input = await inquirer.prompt({
      name: 'package_name',
      type: 'input',
      message: 'Which package name are you looking for?',
    })

    const packageName = input.package_name.trim()

    if (!packageName) {
      console.error('Please provide a package name.')
      continue
    }

    if (packageName.toLowerCase() === 'exit') {
      process.exit(0)
    }

    await searchForPackage(packageName)
    break
  }
}

console.clear()

const packageName = process.argv[2]

if (!packageName) {
  await getUserInput()
} else {
  if (packageName === '--loop' || packageName === '-l') {
    while (true) {
      await getUserInput()
    }
  } else {
    await searchForPackage(packageName)
  }
}
