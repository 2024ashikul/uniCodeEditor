def sum_of_evens(lst):
    if not isinstance(lst, list):
        raise ValueError("Input must be a list.")
    return sum(num for num in lst if isinstance(num, int) and num % 2 == 0)
