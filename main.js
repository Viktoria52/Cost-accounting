let allCosts = [];
try {
    allCosts = JSON.parse(localStorage.getItem('Cost'));
} catch (e) {
    console.log('Cost is empty')
}
let input1 = null;
let input2 = null;
let valueInput1 = '';
let valueInput2 = 0;
let sumMoney = 0;
let valueEditInput1 = '';
let valueEditInput2 = '';


window.onload = async function init() {
    input1 = document.querySelector('.input-where')
    input2 = document.querySelector('.input-how')
    const mainButton = document.querySelector('.main--add')
    mainButton.onclick = () => onClickButton()
    input1.addEventListener('change', updateValue1)
    input2.addEventListener('change', updateValue2)

    const response = await fetch('http://localhost:5000/allCosts', {method: 'GET'})
    let result = await response.json()
    allCosts = result.data;
    render()
}
onClickButton = async () => {
    // const postConnect = new Rectangle(valueInput1,  valueInput2, allCosts);
    // postConnect.patch()
    if (valueInput1, valueInput2) {
        const response = await fetch('http://localhost:5000/createCost',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    text: valueInput1,
                    totalMoney: valueInput2,
                    date: createDate()
                })
            },
        )
        let result = await response.json()
        if (response.status === 200) {
            allCosts.push(result);
        }
        localStorage.setItem('costs', JSON.stringify(allCosts))
        valueInput1 = '';
        valueInput2 = '';
        input1.value = '';
        input2.value = '';

        render()

    }
}

createDate = () => {
    let options = {year: 'numeric', month: 'numeric', day: 'numeric'};
    let now = new Date()
    let dataNow = new Intl.DateTimeFormat('ru', options).format(now)
    return dataNow

}

deleteCost = async (id, index) => {
    const response = await fetch(`http://localhost:5000/deleteCost?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        },
    )
    // let result = await response.text()
    if (response.status === 200) {
        allCosts.splice(index, 1)
    }
    localStorage.setItem('costs', JSON.stringify(allCosts))
    render()
}
updateValue1 = (e) => {
    valueInput1 = e.target.value;
}
updateValue2 = (e) => {
    valueInput2 = e.target.value;
}
changeNewInput1 = (e) => {
    valueEditInput1 = e.target.value
}
changeNewInput2 = (e) => {
    valueEditInput2 = e.target.value
}

updateInputs = async (value1, value2, id, index) => {
    allCosts[index].text = value1;
    allCosts[index].totalMoney = value2;
    // console.log(valueEditInput1, valueEditInput2)
    const response = await fetch('http://localhost:5000/updateCost',
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                _id: id,
                text: value1,
                totalMoney: value2
            })
        },
    ) // let result = await response.json()
    localStorage.setItem('tasks', JSON.stringify(allCosts))

    render()
}
sum = () => {
    return allCosts.reduce((accumulator, currentValue) => accumulator + currentValue.totalMoney, 0)
}
// onloadSum = () => {
//     sum()
//     // const containerSum = document.createElement('div')
//     // containerSum.className = 'container-sum'
//     render()
// }

render = () => {
    const contentWrapper = document.querySelector('.wrapper__content')
    while (contentWrapper.firstChild) {
        contentWrapper.removeChild(contentWrapper.firstChild)
    }
    const contentAll = document.createElement('div')
    contentAll.className = 'sum-and-costs'
    contentWrapper.append(contentAll)

    const containerSum = document.createElement('div')
    containerSum.className = 'sum'
    contentAll.append(containerSum)

    const content = document.createElement('div')
    content.className = 'costs'
    contentAll.append(content)


    // const content = document.querySelector('.costs');
    // const containerSum = document.querySelector('.sum');
    const resultSum = document.createElement('p')
    resultSum.innerText = 'Итого:' + sum()
    containerSum.appendChild(resultSum);

    // contentAll.appendChild(containerSum)
    // contentAll.appendChild(content)

    allCosts.map((cost, index) => {

        const container = document.createElement('div')
        container.id = `cost - ${index}`;
        container.className = 'task-container'
        const numbering = document.createElement('p')
        numbering.innerText = index + 1 + ')';
        container.appendChild(numbering);

        const text = document.createElement('p')  //cost
        text.innerText = cost.text;
        container.appendChild(text);

        const data = document.createElement('p')
        data.className = 'data'
        data.innerText = cost.date
        container.appendChild(data)

        const textMoney = document.createElement('p')
        const textP = document.createElement('p')
        textP.innerText = 'p.'
        textMoney.innerText = cost.totalMoney
        textMoney.className = 'textMoney'
        container.appendChild(textMoney);
        container.appendChild(textP)

        const newInput1 = document.createElement('input')  // input of pencil
        const newInput2 = document.createElement('input')  // input of pencil
        newInput1.type = 'text'
        newInput2.type = 'text'
        newInput1.className = 'newInputs'
        newInput2.className = 'newInputs'
        newInput1.addEventListener('change', changeNewInput1)
        newInput2.addEventListener('change', changeNewInput2)


        let buttonEdit = document.createElement('img')
        buttonEdit.src = 'assets/edit.svg'
        buttonEdit.className = 'mini-button'
        buttonEdit.onclick = function (e) {
            newInput1.value = text.innerText
            newInput2.value = textMoney.innerText
            buttonEdit.classList.add('hide')
            buttonDone.classList.remove('hide')
            text.replaceWith(newInput1)
            textMoney.replaceWith(newInput2)
            container.appendChild(buttonDone)

        }

        let buttonDelete = document.createElement('img')
        buttonDelete.src = 'assets/delete.svg'
        // buttonDelete.className = 'mini-button'
        buttonDelete.onclick = async function () {
            await deleteCost(cost._id, index)
        }

        let buttonDone = document.createElement('img')
        buttonDone.src = 'assets/okay.svg'
        buttonDone.classList = ('mini-button', 'hide')
        buttonDone.onclick = function (e) {
            buttonEdit.classList.remove('hide')
            buttonDone.classList.add('hide')
            if (!valueEditInput1) {
                valueEditInput1 = text.innerText
            }
            if (!valueEditInput2) {
                valueEditInput2 = textMoney.innerText
            }
            updateInputs(valueEditInput1, valueEditInput2, cost._id, index)
            valueEditInput1 = ''
            valueEditInput2 = ''
        }

        container.appendChild(buttonEdit)
        container.appendChild(buttonDelete);
        content.appendChild(container);


    })

}