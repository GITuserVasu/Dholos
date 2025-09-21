import getpass
import os
import langchain

if not os.environ.get("OPENAI_API_KEY"):
  os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter API key for OpenAI: ")

from langchain.chat_models import init_chat_model

# model = init_chat_model("gpt-4o-mini", model_provider="openai")
model = init_chat_model("gpt-5-nano", model_provider="openai")

from langchain_core.messages import AIMessage
from langchain_core.messages import HumanMessage

response = model.invoke(
    [
        HumanMessage(content="Hi! I'm Bob"),
        AIMessage(content="Hello Bob! How can I assist you today?"),
        HumanMessage(content="What's my name?"),
    ]

)
print(response.content)