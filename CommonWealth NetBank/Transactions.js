// Example: getDebitFrom('WOOLWORTHS')

function isPositive(number) {
  return number > 0;
}

function findElement(context, selector) {
  const element = context.querySelector(selector);
  if (element === null) throw 'Element not found for selector: ' + selector
  return element;
}

function getDebitFrom(merchantInput) {
  const table = document.getElementById('transactionsTableBody');
  const transactions = table.querySelectorAll('tr');
  console.log(transactions.length, 'transactions')

  const filteredTransactions = [].slice.call(transactions).filter(function(transaction) {
    try {
      const merchant = findElement(transaction, '.merchant');
      const matchesMerchant = merchant.innerText.match(merchantInput);
      if (matchesMerchant) return true;
    } catch (e) {}
  });
  console.log(filteredTransactions.length, 'transactions for: ', merchantInput);

  return filteredTransactions.reduce(function(previous, current) {
    const innerText = findElement(current, '.currencyUI').innerText
    const textWithoutDollarSign = innerText.split('$').join('');
    const textWithoutComma = textWithoutDollarSign.split(',').join('');
    const asNumber = Number(textWithoutComma)
    // Is debit transaction?
    if (!isPositive(asNumber)) {
      console.log('text: ' + innerText, 'asNumber: ' + Number(asNumber));
      return previous + asNumber
    }
    return previous;
  }, 0);
}