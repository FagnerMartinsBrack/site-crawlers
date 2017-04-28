// Example: getDebitFrom('WOOLWORTHS', (value) => value > -10)

function isPositive(number) {
  return number > 0;
}

function findElement(context, selector) {
  const element = context.querySelector(selector);
  if (element === null) throw 'Element not found for selector: ' + selector
  return element;
}

function findValueFor(transaction) {
  const innerText = findElement(transaction, '.currencyUI').innerText
  const textWithoutDollarSign = innerText.split('$').join('');
  const textWithoutComma = textWithoutDollarSign.split(',').join('');
  return Number(textWithoutComma)
}

function getDebitFrom(merchantInput, filter) {
  const table = document.getElementById('transactionsTableBody');
  const transactions = table.querySelectorAll('tr');
  console.info(transactions.length + ' transactions')

  const filteredTransactions = [].slice.call(transactions).filter(function(transaction) {
    try {
      const merchant = findElement(transaction, '.merchant');
      const matchesMerchant = merchant.innerText.match(merchantInput);
      if (matchesMerchant) return true;
    } catch (e) {}
  });
  console.info(filteredTransactions.length + ' transactions for: ' + merchantInput);

  const debitTransactions = filteredTransactions.filter(function(transaction) {
    const value = findValueFor(transaction);
    // Is debit transaction?
    if (!isPositive(value)) {
      return true;
    }
    return false;
  });
  console.info(debitTransactions.length + ' debit transactions for: ' + merchantInput);

  return debitTransactions.reduce(function(previous, currentTransaction) {
    const value = findValueFor(currentTransaction);
    if (filter(value)) {
      const innerText = findElement(currentTransaction, '.currencyUI').innerText
      console.log('text: ' + innerText, 'asNumber: ' + value);
      return previous + value
    }
    return previous;
  }, 0);
}