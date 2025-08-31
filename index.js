#!/usr/bin/env node

import inquirer from 'inquirer'
import { createSpinner } from 'nanospinner'
import chalk from 'chalk'

const availableMessage = (exists) => {
  if (exists) {
    return chalk.red('Taken')
  }
  return chalk.green('Not Taken')
}

const searchForPackage = async (name) => {
  const orgURL = `https://www.npmjs.com/org/${name}`
  const packageURL = `https://www.npmjs.com/package/${name}`

  const spinner = createSpinner(`Checking ${name}`).start()

  try {
    const orgResponse = await fetch(orgURL)
    const packageResponse = await fetch(packageURL)

    spinner.stop()

    const orgExists = orgResponse.status === 200
    const packageExists = packageResponse.status === 200

    const orgExistsMsg = availableMessage(orgExists)
    const packageExistsMsg = availableMessage(packageExists)

    console.log('\n')

    if (orgExists && packageExists) {
      console.log(chalk.red('❌ Both Organization and Package are taken.'))
    } else if (!orgExists && !packageExists) {
      console.log(
        chalk.green('✅ Both Organization and Package are not taken.')
      )
    } else {
      console.log(`🌐 Organization  : ${orgExistsMsg}\n`)
      console.log(`📦 Package       : ${packageExistsMsg}`)
    }

    console.log('\n')
  } catch (err) {
    if (err) {
      spinner.stop()
      console.log('\n')
      console.log(
        chalk.yellow('⚠️ Something went wrong. Please try again later.')
      )
      console.log('\n')
      process.exit(1)
    }
  }
}

const getUserInput = async () => {
  while (true) {
    const input = await inquirer.prompt({
      name: 'package_name',
      type: 'input',
      message: 'What package name you are looking for?',
    })

    const packageName = input.package_name

    if (!packageName) {
      console.error('Please provide a package name')
      continue
    }

    if (packageName === 'exit') {
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

#testingrandomstuff
