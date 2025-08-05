
import matplotlib.pyplot as plt
import numpy as np

def plot_adc_staircase(vref=5.0, bits=8):
    levels = 2 ** bits
    step = vref / levels
    input_voltage = np.linspace(0, vref, 1000)
    digital_output = np.floor(input_voltage / vref * (levels - 1))

    plt.figure(figsize=(10, 5))
    plt.step(input_voltage, digital_output, where='post', color='blue')
    plt.title(f"{bits}-bit ADC Transfer Characteristic")
    plt.xlabel("Analog Input Voltage (V)")
    plt.ylabel("Digital Output Code")
    plt.grid(True)
    plt.xlim(0, vref)
    plt.ylim(0, levels)
    plt.show()

# Run the function
plot_adc_staircase()

