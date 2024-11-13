import java.io.Serializable;

public class Person implements Serializable{
  
    private String name;
    private int age;
    
    
    public Person() {
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
public class Main {
    public static void main(String[] args) {
        //
        Person person = new Person();
        
   
        person.setName("Adarsh Yadav");
        person.setAge(20);
        
        System.out.println("Name: " + person.getName());
        System.out.println("Age: " + person.getAge());
    }
}
