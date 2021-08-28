function getBalanceSummary() {
  return {
    accountDetails: [
      {
        accountId: '6122f9077a20e533d01848e2',
        lastTxDate: '2021-08-21',
        accountAdmin: 'Bank of America',
        accountName: 'Checking',
        balance: 2501.15
      },
      {
        accountId: '6122f9307a20e533d01848e4',
        lastTxDate: '2021-08-23',
        accountAdmin: 'Bank of America',
        accountName: 'Credit',
        balance: 13779.73,
        credit: -3579.73
      },
      {
        accountId: '6122f91b7a20e533d01848e3',
        lastTxDate: '2021-08-21',
        accountAdmin: 'Bank of America',
        accountName: 'Savings',
        balance: 300.52
      }
    ]
  };
};

function getAccountDetails(accountId) {
  var accountName;
  switch (accountId) {
    case '6122f9077a20e533d01848e2':
      accountName = 'Checking';
      break;
    case '6122f91b7a20e533d01848e3':
      accountName = 'Savings';
      break;
    case '6122f9307a20e533d01848e4':
      accountName = 'Credit';
      break;
    default:
      accountName = '';
      break;
  }
  return {
    accountName: accountName,
    transactions: [
      {
        date: '2021-08-17',
        description: 'Speedway (West Springfield, MA)',
        category: 'Gas',
        amount: 43.41
      },
      {
        date: '2021-08-18',
        description: 'KtC',
        category: 'Transfer to BoA Savings',
        amount: 0.59
      },
      {
        date: '2021-08-19',
        description: 'Amazon Store Card Payment',
        category: 'Transfer to Amazon Store Card',
        amount: 185.9
      },
      {
        date: '2021-08-21',
        description: 'Lighthouse Liquors',
        category: 'Alcohol & Bars',
        amount: 13.59
      },
    ]
  };
};

module.exports = {
  getBalanceSummary,
  getAccountDetails
};
