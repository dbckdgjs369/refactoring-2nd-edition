function statement(invoice, plays) {
  //본문전체를 별도 함수로 추출
  const statementData = {}; //중간 데이터 구조 인수로 전달
  statementData.customer = invoice.customer; //고객데이터를 중간 데이터로 옮김
  statementData.performances = invoice.performances.map(enrichPerformance);
  return renderPlainText(statementData, plays);

  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    return result;
  }
  function playFor(aPerformance) {
    //playFor 함수를 옮김
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance) {
    let result = 0;
    switch (aPerformance.play.type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30_000;

        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;

      default:
        throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`);
    }
    return result;
  }
}
function renderPlainText(data, plays) {
  let result = `청구내역 (고객명: ${data.customer})\n`; //고객데이터를 중간 데이터로 부터 얻기
  for (let perf of data.performances) {
    result += `${perf.play.name}: ${usd(perf.amount)} ${perf.audience}석\n`;
  }
  result += `총액 ${usd(totalAmount())}\n`;
  result += `적립 포인트 ${totalVolumeCredits()}점\n`;
  return result;
}

function totalAmount() {
  let result = 0;

  for (let perf of data.performances) {
    result += perf.amount;
  }
  return result;
}
function totalVolumeCredits() {
  let result = 0;

  for (let perf of data.performances) {
    result += volumeCreditsFor(perf);
  }
  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(aNumber / 100);
}

function volumeCreditsFor(aPerformance) {
  let result = 0;
  result += Math.max(aPerformance.audience - 30, 0);

  if ("comedy" === aPerformance.play.type) {
    result += Math.floor(aPerformance.audience / 5);
  }

  return result;
}
