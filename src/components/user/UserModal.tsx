import styled from "styled-components";
import GreyInput from "../common/GreyInput";
import Button from "../common/Button";
import {
  Dispatch,
  SetStateAction,
  MouseEvent,
  useState,
  useEffect,
  ChangeEvent,
} from "react";
import { accountConnect, accountList, myAccount } from "../../lib/API/userAPI";

interface IModalProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

interface IBank {
  name: string;
  code: string;
  digits: number[];
  disabled: boolean;
}

function AccountModal({ setIsModalOpen }: IModalProps) {
  const [accountForm, setAccountForm] = useState({
    accountNumber: "",
    phoneNumber: "",
    signature: true,
  });
  const [checkedCode, setCheckedCode] = useState("");
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    getUsableAccounts();
  }, []);

  const getUsableAccounts = async () => {
    const res = await accountList();
    setAccounts(res);
  };

  const onClose = (event: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    setIsModalOpen(false);
  };

  const onCheck = (code: string) => {
    setCheckedCode(code);
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAccountForm((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const onSubmit = async () => {
    try {
      const props = Object.values(accountForm) as [string, string, boolean];
      await accountConnect(checkedCode, ...props);
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ModalBackground>
      <Modal onSubmit={onSubmit}>
        <ModalClose type="button" onClick={onClose}>
          x
        </ModalClose>
        <ModalTitle>계좌 추가</ModalTitle>
        <AccountSelect>
          {accounts
            ? accounts.map((account: IBank) => {
                return (
                  account.disabled || (
                    <UsableAccount key={account.code}>
                      <input
                        type="radio"
                        id={account.code}
                        name="account"
                        onChange={() => {
                          onCheck(account.code);
                        }}
                      />
                      <label htmlFor={account.code}>
                        {account.name} [{account.digits}]
                      </label>
                    </UsableAccount>
                  )
                );
              })
            : ""}
        </AccountSelect>
        <AccountInputs>
          <InputBox>
            <span>은행코드</span>
            <GreyInput
              type="text"
              name="bankCode"
              placeholder="은행코드를 선택해주세요"
              value={checkedCode}
              onChange={onChange}
              readonly
              required
            />
          </InputBox>
          <InputBox>
            <span>계좌번호</span>
            <GreyInput
              type="text"
              name="accountNumber"
              onChange={onChange}
              placeholder="계좌번호를 입력해주세요"
              required
            />
          </InputBox>
          <InputBox>
            <span>전화번호</span>
            <GreyInput
              type="text"
              name="phoneNumber"
              onChange={onChange}
              placeholder="전화번호를 입력해주세요"
              require
            />
          </InputBox>
        </AccountInputs>
        <Notes>
          <p>추가할 은행을 선택하면 은행코드가 입력됩니다.</p>
          <p>계좌번호와 전화번호에는 - 구분없이 입력해주세요.</p>
        </Notes>
        <AddButton type="submit" orange>
          추가하기
        </AddButton>
      </Modal>
    </ModalBackground>
  );
}
const ModalBackground = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  backdrop-filter: brightness(60%);
`;
const Modal = styled.form`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 640px;
  height: 660px;
  display: flex;
  position: fixed;
  align-items: center;
  border-radius: 20px;
  flex-direction: column;
  background-color: #fff;
  justify-content: space-around;
`;

const ModalTitle = styled.h2`
  font-size: 30px;
  font-weight: 800;
`;

const ModalClose = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
`;

const AccountSelect = styled.ul`
  display: flex;
  flex-wrap: wrap;
  width: 440px;
  height: 139px;
  background-color: aliceblue;
`;

const UsableAccount = styled.li`
  width: 220px;
  height: 22px;

  input {
    margin-right: 0.5rem;
  }
`;

const AccountInputs = styled.div`
  width: 509px;
  height: 154px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: aliceblue;
`;

const InputBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AddButton = styled(Button)`
  width: 428px;
  height: 50px;
`;

const Notes = styled.div``;

export default AccountModal;
