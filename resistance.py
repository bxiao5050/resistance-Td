from tkinter import *
from tkinter import ttk
from scipy.signal import argrelextrema, find_peaks, savgol_filter

import pandas as pd
import numpy as np
from matplotlib.figure import Figure
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg, NavigationToolbar2Tk

import resistance

class InputData(LabelFrame):
    def __init__(self, master, x0 = None, y0 =None):
        super().__init__(master)
        self.ax_up = [] #up
        self.canvas1 = []

        self.f_up = Frame(self)
        self.f_down = Frame(self)
        self.f_up.pack(fill=BOTH, expand=1)
        self.f_down.pack( fill=BOTH, expand=1)

        #upper side
        self.canvasB = {}
        self.var = IntVar()
        self.R = [] #radio buttons


        if x0 is None:
            data = pd.read_csv('first batch\\_test_3_27000_58500.csv', header = 1)
            self.x0 = data.iloc[:, 0].to_numpy()
            self.y0 = data.iloc[:, 1].to_numpy()
        else:
            self.x0, self.y0 = x0, y0

        v = self.getSection()
        self.line = v['line'] # self.line[0]  = [x, y]
        self.section = v['section']

        # print(self.section)

        # self.myPlot()


    def myPlot(self):

        for i in range(len(self.line)):
            self.R.append(Radiobutton(self.f_up, text = f'section:{i+1}', variable = self.var, value = i, command = self.on_selection))
            self.R[i].grid(row = 0, column = i)

            self.canvasB[i] = Canvas(self.f_up, width = 6, height = 6)
            self.canvasB.get(i).grid(row = 1, column = i, padx = (5,5), sticky = 'news')

            f = Figure(figsize = (2, 2))
            self.canvas1.append(FigureCanvasTkAgg(f, master = self.canvasB.get(i)))
            self.canvas1[i].get_tk_widget().pack()
            self.ax_up.append(f.add_subplot(111))
            self.ax_up[i].plot(self.line[i][0], self.line[i][1], label = f'section: {i+1}')
            self.ax_up[i].legend()
            self.canvas1[i].draw()

        #down side
        f2 = Figure()
        self.canvas2 = FigureCanvasTkAgg(f2, master = self.f_down)
        self.canvas2.get_tk_widget().pack(side=TOP, fill=BOTH, expand=1)
        toolbar = NavigationToolbar2Tk(self.canvas2, self.f_down)
        toolbar.update()
        self.ax_middle = f2.add_subplot(211)
        self.ax_down = f2.add_subplot(212)
        self.ax_middle.plot(self.x0)
        self.ax_middle.plot(self.section, self.x0[self.section], 'ro')
        for i in range(len(self.line)):
            self.ax_down.plot(self.line[i][0], self.line[i][1], label = f'section: {i+1}')
        self.ax_down.legend()
        self.canvas2.draw()

def main():
    root = Tk()
    InputData(root).pack(fill=BOTH, expand=1)
    root.mainloop()

if __name__ == '__main__':
    main()
