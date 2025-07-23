def sum_of_evens(lst):
    even_sum = 0
    for i in lst:
        if i % 2 == 0:
            even_sum += i
    return even_sum
