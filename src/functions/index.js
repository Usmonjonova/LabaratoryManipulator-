

export function sortAndCount(input) {
    let result = [];
    let count = 1;

    for (let i = 0; i < input.length; i++) {
        if (input[i] === input[i + 1]) {
            count++;
        } else {
            result.push([count.toString(), input[i]]);
            count = 1;
        }
    }

    return result;
}

export function generateOriginal(arr) {
    let result = '';
    arr.forEach(([count, char]) => {
        result += char.repeat(parseInt(count));
    });
    return result;
}

export function generateOptimized(arr) {
    let result = '';
    arr.forEach(([count, char]) => {
        result += `${count}${char}`;
    });
    return result;
}

export function formatDateTime() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}

console.log(formatDateTime());
