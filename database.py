from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

engine = create_engine("sqlite:///chat_history.db")

Base = declarative_base()


class ChatMessage(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    user_id = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.now)

Base.metadata.create_all(engine)

SessionLocal = sessionmaker(bind=engine)

def save_message(role: str,content: str):
    session = SessionLocal()
    message = ChatMessage(role=role, content = content)
    session.add(message)
    session.commit()
    session.close()

def load_history():
    session = SessionLocal()
    messages = session.query(ChatMessage).order_by(ChatMessage.timestamp).all()
    session.close()

    history =[]
    for message in messages:
        history.append({"role": message.role, "content": message.content})
    return history

def clear_history():
    session = SessionLocal()
    session.query(ChatMessage).delete()
    session.commit()
    session.close()