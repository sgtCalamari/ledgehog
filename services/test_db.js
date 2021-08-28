function getBalanceSummary() {
  return {
    accountDetails: [
      {
        accountId: '123567890',
        lastTxDate: '2021-08-21',
        accountAdmin: 'Bank of America',
        accountName: 'Checking',
        balance: 2501.15
      },
      {
        accountId: '123567890',
        lastTxDate: '2021-08-23',
        accountAdmin: 'Bank of America',
        accountName: 'Credit',
        balance: 13779.73,
        credit: -3579.73
      },
      {
        accountId: '123567890',
        lastTxDate: '2021-08-21',
        accountAdmin: 'Bank of America',
        accountName: 'Savings',
        balance: 300.52
      }
    ]
  };
};

function getAccountDetails() {
  return {
    accountName: 'Checking',
    transactions: [
      {
        date: '2021-08-17',
        desc: 'Speedway (West Springfield, MA)',
        category: 'Gas',
        amount: 43.41
      },
      {
        date: '2021-08-18',
        desc: 'KtC',
        category: 'Transfer to BoA Savings',
        amount: 0.59
      },
      {
        date: '2021-08-19',
        desc: 'Amazon Store Card Payment',
        category: 'Transfer to Amazon Store Card',
        amount: 185.9
      },
      {
        date: '2021-08-21',
        desc: 'Lighthouse Liquors',
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
