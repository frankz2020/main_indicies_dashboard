import yfinance as yf
from matplotlib import pyplot as plt
import os

'''
today_date = datetime.now().date().strftime("%Y-%m-%d")
search_list = ['^GSPC', '^IXIC','000002.SS', '399107.SZ', 'GC=F', 'BZ=F']

tickers = yf.Tickers(" ".join(search_list))
tickers.tickers['^GSPC'].info['longName']
'''

# Directory of the current script
current_directory = os.path.dirname(__file__)
image_directory = os.path.join(current_directory, 'images')

def generate_plots(ticker_list):
    if not os.path.exists(image_directory):
        os.makedirs(image_directory)

    tickers = yf.Tickers(" ".join(ticker_list))
    for ticker in ticker_list:
        try:
            name = tickers.tickers[ticker].info['longName']
        except:
            name = tickers.tickers[ticker].info['shortName']
        df = tickers.tickers[ticker].history(start="2022-01-01", interval="1d")
        plt.figure()
        df['Close'].plot(kind='line', figsize=(8, 4), title=name)
        plt.gca().spines[['top', 'right']].set_visible(False)
        plt.savefig(os.path.join(image_directory, f'{ticker}.png'))
        plt.close()